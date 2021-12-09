package com.compulynx.compas.controllers;

import java.util.HashSet;
import java.util.List;

import com.compulynx.compas.security.AESsecure;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.compulynx.compas.customs.Api;
import com.compulynx.compas.customs.responses.GlobalResponse;
import com.compulynx.compas.models.extras.CardInfo;
import com.compulynx.compas.models.extras.ServerConfig;
import com.compulynx.compas.models.extras.TopFiveBranches;
import com.compulynx.compas.repositories.BranchRepository;
import com.compulynx.compas.repositories.CustomerRepository;

@RestController
@RequestMapping(value = Api.REST)
public class DashboardController {
    @Autowired
    private Environment env;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BranchRepository branchRepository;
    Gson gson = new Gson();
//	@Autowired
//	private CountryRepository countryRepository;
//	
//	@Autowired
//	private UserRepository userRepository;

    @GetMapping("/dashboard/cardinfo")
    public ResponseEntity<?> cardInfo() {
        try {
            int customers = customerRepository.getCustomerCount();
            int branches = customerRepository.getEnrolledBranchesCount();
            int waivedBranches = branchRepository.getWaivedBranchesCount();

            CardInfo cin = new CardInfo();

            cin.setBraches(branches);
            cin.setCustomers(customers);
            cin.setWaivedBranches(waivedBranches);

            return new ResponseEntity<>(cin, HttpStatus.OK);
        } catch (Exception e) {
            GlobalResponse resp = new GlobalResponse("404", "Server failure authenticating user", false, GlobalResponse.APIV);
            e.printStackTrace();
            return new ResponseEntity<>(resp, HttpStatus.OK);
        }
    }

    @GetMapping(value = "/dashboard/configs")
    public ResponseEntity<?> getConfigs(@RequestHeader HttpHeaders httpHeaders) {
        String response = "";

//        System.out.println("gson.toJson(env).toString()");
//        System.out.println(env);

        System.out.println("env.getProperty(cobankingAuthName)");
        System.out.println(env.getProperty("abis"));
        System.out.println(env.getProperty("greenbit"));
        System.out.println(env.getProperty("sessionTimeout"));
        System.out.println(env.getProperty("sessionIdle"));
        System.out.println(env.getProperty("jwt"));
        System.out.println(env.getProperty("secugen"));

        try {


            String authName = env.getProperty("cobankingAuthName");
            String authPass = env.getProperty("cobankingAuthPass");
            String t24se = env.getProperty("tserver");
            String cobanking = env.getProperty("cobanking");
            String abis = env.getProperty("abis");
            String greenbit = env.getProperty("greenbit");
            String secugen = env.getProperty("secugen");
            String sessionTimeout = env.getProperty("sessionTimeout");
            String sessionIdle = env.getProperty("sessionIdle");
            String jwt = env.getProperty("jwt");

            ServerConfig resp = new ServerConfig(t24se, cobanking, abis, greenbit, secugen, authPass, authName, sessionTimeout, sessionIdle, jwt);

            System.out.println("Here is the response");
            System.out.println(resp);

//            response = resp.toString();
            response = AESsecure.encrypt(gson.toJson(resp).toString());
        } catch (Exception e) {
            GlobalResponse resp = new GlobalResponse("404", "Server failure authenticating user", false, GlobalResponse.APIV);
            e.printStackTrace();
            System.out.println("Here is the response");
            System.out.println(resp);
//            response = resp.toString();
            response = AESsecure.encrypt(gson.toJson(resp).toString());
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/dashboard/topbranches")
    public ResponseEntity<?> topBranches() {
        try {
            List<TopFiveBranches> customers = customerRepository.getTopFiveBranches();
            if (customers.size() > 0) {
                return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "000",
                        true, "customers found",
                        new HashSet<>(customers)), HttpStatus.OK);
            }
            return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "201",
                    false, "no customers found",
                    new HashSet<>(customers)), HttpStatus.OK);
        } catch (Exception e) {
            GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
            e.printStackTrace();
            return new ResponseEntity<>(resp, HttpStatus.OK);
        }
    }
//	@GetMapping("/dashboard/stats")
//	public ResponseEntity<?> starts() {
//		int year = Calendar.getInstance().get(Calendar.YEAR);
//		int month=Calendar.getInstance().get(Calendar.MONTH);
//		int custs = customerRepository.countEnrolledCustomers();
//		int bra = branchRepository.getBranchCount();
//		int ter = branchRepository.getBranchCount();
//		int dist = countryRepository.getCountryCountry();
//		int rej = customerRepository.countRejectedCustomers();
//		int users = userRepository.getUserCount();
//		int acMonth = customerRepository.getMonthActiveCustomers(month+1);
//		int activecusts =customerRepository.getActiveCustomers();
//		System.out.println("Year###"+year +"month##"+month);
//		int menroll = customerRepository.getMonthlyCount(year,month+1);
//		List<CustomerStats> monthlystats = customerRepository.getYearlyCustomerStats();
//		//List<UsernamesExists> usernamesExists = userRepository.getExistingUsernames();
//		ArrayList<Integer> series = new ArrayList<Integer>();
//		ArrayList<String> usernames =new ArrayList<>();
//		
//		for(CustomerStats stat: monthlystats) {
//			
//			series.add(stat.getCount());
//			
//		}
////		if(usernamesExists.size() > 0) {
////			for(UsernamesExists usr: usernamesExists) {
////				usernames.add(usr.getUsername());
////			}
////		}
//		
//		ArrayList<ArrayList<Integer>> outer = new ArrayList<ArrayList<Integer>>();
//		
//		outer.add(series);
//		
//		return new ResponseEntity<>(new DashboardStats(custs,
//				new LineChart(LineChart.YEAR,outer),bra,ter,dist,users,activecusts,
//				menroll,acMonth,usernames,rej), HttpStatus.OK);
//	}
}
